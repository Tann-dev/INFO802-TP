from spyne import Application, rpc, ServiceBase, \
    Integer, Unicode , Decimal, Boolean
from spyne import Iterable
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication
import decimal
from wsgiref.simple_server import make_server

# Le service va dire autant que fois qu'on le demande notre nom
class CalculTrajetService(ServiceBase):
    @rpc(Decimal, Boolean, Integer, _returns=Integer)
    def tempsTrajet(ctx, distanceEnKm, isFastCharging, nbBornes):
        ctx.transport.resp_headers['Access-Control-Allow-Origin'] = '*'
        tempsArret = 60
        if isFastCharging:
            tempsArret = 30 
        vMoyKmH = 110
        return (tempsArret * nbBornes) + (distanceEnKm / vMoyKmH * 60)

application = Application([CalculTrajetService], 'spyne.examples.trajet.soap',
        in_protocol=Soap11(validator='lxml'),
        out_protocol=Soap11())
wsgi_application = WsgiApplication(application)

# app = wsgi_application
server = make_server('127.0.0.1', 3001, wsgi_application)
server.serve_forever()